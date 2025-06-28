"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Email validation regex
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password validation (minimum 8 characters)
  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://eriq.onrender.com/auth/login",
        { email, password, mode: "session" },
        { withCredentials: true }
      );

      if (res.status === 200) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        router.push("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f0]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-300 shadow-md p-8">
        <div className="flex flex-col items-center mb-8">
          <span className="inline-block bg-blue-100 text-blue-600 rounded-full p-3 mb-3">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z"
              />
            </svg>
          </span>
          <h2 className="text-3xl font-bold text-blue-700">
            Healthcare Portal Login
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Access your patient portal
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              className={`w-full bg-gray-50 text-gray-800 border ${
                error && !isValidEmail(email)
                  ? "border-red-500"
                  : "border-gray-200"
              } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              className={`w-full bg-gray-50 text-gray-800 border ${
                error && !isValidPassword(password)
                  ? "border-red-500"
                  : "border-gray-200"
              } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold rounded-lg py-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600">
          New to our portal?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-semibold hover:underline transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
