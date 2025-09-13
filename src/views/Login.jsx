// src/views/Login.jsx
// Purpose: Simple, centered login form.
// - Works with demo creds: username "user" + password "password"
// - Works with Firebase email/password for anything else (via AuthContext.login)
// - Clean error handling and keyboard-friendly
//
// Layout notes:
// - We use MainLayout so header/footer still render.
// - Inside main content, we center the card using CSS grid (place-items-center).
// - The section has min-height so it "visually centers" even with header/footer present.

import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();            // from AuthContext (demo + firebase)
  const navigate = useNavigate();

  // Single "identifier" field supports either username ("user") or an email.
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    // Prevent empty submits (avoids unhandled promise rejections)
    if (!identifier.trim() || !password.trim()) {
      setErr("Please enter username/email and password");
      return;
    }

    setLoading(true);
    try {
      // IMPORTANT: await so we can catch errors here
      await login(identifier.trim(), password);
      // success → send to home or dashboard
      navigate("/");
    } catch (error) {
      setErr(error?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      {/* Center the card within the page content area */}
      <section className="min-h-[70vh] grid place-items-center px-4">
        {/* Card */}
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-6 shadow-xl">
          {/* Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white text-center">
            Welcome back
          </h1>
          <p className="text-white/60 text-center mt-1 mb-5">
            Sign in to continue
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username or Email */}
            <label className="block">
              <span className="sr-only">Username or Email</span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder='Username "user" or your email'
                autoComplete="username"
                className="w-full h-11 px-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>

            {/* Password */}
            <label className="block">
              <span className="sr-only">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password (demo: "password")'
                autoComplete="current-password"
                className="w-full h-11 px-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>

            {/* Error message (if any) */}
            {err && <p className="text-rose-400 text-sm">{err}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-60 transition"
            >
              {loading ? "Please wait…" : "Log in"}
            </button>

            {/* Helper for demo creds */}
            <p className="text-xs text-white/60 text-center">
              Demo login: <strong>user</strong> / <strong>password</strong>
            </p>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
