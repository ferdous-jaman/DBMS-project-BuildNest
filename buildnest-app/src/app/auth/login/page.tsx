"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { MdConstruction } from "react-icons/md";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Welcome to BuildNest! 🏗️");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-950 p-12 border-r border-dark-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #f5a623 0, #f5a623 1px, transparent 0, transparent 50%)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-600/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center">
              <MdConstruction className="text-2xl text-dark-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-dark-50">BuildNest</h1>
              <p className="text-xs text-brand-400 font-medium">
                Where Owners & Workers Meet
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-dark-50 leading-tight mb-4">
              Manage Your
              <span className="block gradient-text">Construction Empire</span>
            </h2>
            <p className="text-dark-300 text-lg leading-relaxed">
              Complete construction site management — track workers, materials,
              expenditures, and progress all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Active Projects", value: "20+" },
              { label: "Workers Managed", value: "500+" },
              { label: "Total Transactions", value: "৳50Cr+" },
              { label: "Safety Rate", value: "98%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-dark-800/60 border border-dark-700 rounded-xl p-4 backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-brand-400">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-dark-500">
          © 2024 BuildNest. All rights reserved.
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <MdConstruction className="text-xl text-dark-950" />
            </div>
            <h1 className="text-xl font-bold text-dark-50">BuildNest</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-dark-50 mb-2">
              Welcome back
            </h2>
            <p className="text-dark-400">Sign in to your BuildNest account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="label">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 text-sm" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 text-sm" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-dark-950 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to BuildNest"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-dark-800 border border-dark-700 rounded-xl">
            <p className="text-xs text-dark-400 mb-2 font-medium">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-xs text-dark-300">
              <p>
                Username:{" "}
                <span className="text-brand-400 font-mono">admin</span>
              </p>
              <p>
                Password:{" "}
                <span className="text-brand-400 font-mono">buildnest@2024</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
