// src/components/Footer.jsx
// "Subscribe to Premium" form that uses the existing Toast component for UX.


import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Toast from "./Toast"; // re-use the tiny toast we created earlier

export default function Footer() {
  // --- Toast state (used for subscribe feedback) ---
  const [toastShow, setToastShow] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Helper to show a toast for ~1.6s
  function showToast(message) {
    setToastMsg(message);
    setToastShow(true);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToastShow(false), 1600);
  }

  // --- Simple email capture state (no backend yet) ---
  const [email, setEmail] = useState("");

  // Handle subscribe click; validate basic email shape and toast
  function onSubscribe(e) {
    e.preventDefault();
    const ok = /\S+@\S+\.\S+/.test(email); // minimal client-side check
    if (!ok) return showToast("Please enter a valid email");
    // TODO (later): send to Firestore / backend / Stripe webhook
    setEmail("");
    showToast("Thanks! We’ll be in touch ✨");
  }

  return (
    <footer className="mt-10 border-t border-white/10 bg-[#0e1623] text-white">
      {/* Global toast for footer actions (positioned via Toast component) */}
      <Toast show={toastShow} message={toastMsg} tone="info" />

      {/* Upper footer: three columns on md+, stacked on mobile */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        {/* --- Column 1: Brand + short blurb + social icons --- */}
        <div>
          {/* Brand / app name links back to home */}
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            MealSearch
          </Link>

          {/* Short descriptive tagline */}
          <p className="mt-3 text-white/70">
            Plan. Cook. Enjoy. Discover recipes you’ll love and keep your week organized.
          </p>

          {/* Social icons row (SVGs, no external deps) */}
          <div className="mt-4 flex items-center gap-3">
            {/* GitHub */}
            <SocialIcon
              label="GitHub"
              href="https://github.com/"
              svg={
                <path
                  fill="currentColor"
                  d="M12 0C5.37 0 0 5.4 0 12.07c0 5.33 3.44 9.85 8.21 11.45.6.11.82-.27.82-.6
                  0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.63-4.04-1.63-.55-1.42-1.34-1.8-1.34-1.8-1.09-.76.08-.74.08-.74
                  1.2.08 1.83 1.25 1.83 1.25 1.07 1.86 2.81 1.32 3.5 1.01.11-.79.42-1.32.76-1.63-2.66-.31-5.46-1.36-5.46-6.06
                  0-1.34.47-2.43 1.24-3.29-.12-.31-.54-1.57.12-3.27 0 0 1.01-.33 3.3 1.26a11.2 11.2 0 0 1 3.01-.41c1.02 0 2.05.14 3.01.41
                  2.28-1.59 3.29-1.26 3.29-1.26.66 1.7.24 2.96.12 3.27.78.86 1.24 1.95 1.24 3.29 0 4.71-2.8 5.74-5.47 6.05.43.38.81 1.12.81 2.26
                  0 1.63-.02 2.95-.02 3.35 0 .33.21.72.83.6C20.56 21.92 24 17.4 24 12.07 24 5.4 18.63 0 12 0z"
                />
              }
            />
            {/* Instagram */}
            <SocialIcon
              label="Instagram"
              href="https://instagram.com/"
              svg={
                <>
                  <path fill="currentColor" d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.22.4.56.22.96.49 1.38.91.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22a3.88 3.88 0 0 1-.9 1.38 3.88 3.88 0 0 1-1.38.9c-.42.16-1.05.36-2.22.41-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41a3.88 3.88 0 0 1-1.38-.9 3.88 3.88 0 0 1-.9-1.38c-.16-.42-.36-1.05-.41-2.22C2.2 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.49-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41C8.42 2.21 8.8 2.2 12 2.2Z"/>
                  <circle fill="currentColor" cx="18.4" cy="5.6" r="1.3"/>
                  <path fill="currentColor" d="M12 6.5A5.5 5.5 0 1 0 12 17.5 5.5 5.5 0 0 0 12 6.5Zm0 2.2a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Z"/>
                </>
              }
            />
            {/* X / Twitter */}
            <SocialIcon
              label="X (Twitter)"
              href="https://x.com/"
              svg={<path fill="currentColor" d="M18.25 2H21l-6.5 7.43L22 22h-6.78l-5.3-6.77L3.9 22H1.13l7.03-8.04L2 2h6.85l4.78 6.23L18.25 2Zm-2.37 18h1.75L7.19 4H5.34l10.54 16Z"/>}
            />
            {/* YouTube */}
            <SocialIcon
              label="YouTube"
              href="https://youtube.com/"
              svg={
                <path
                  fill="currentColor"
                  d="M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.37.46A3.02 3.02 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.13 2.14C4.5 20.4 12 20.4 12 20.4s7.5 0 9.37-.46a3.02 3.02 0 0 0 2.13-2.14c.34-1.86.5-3.73.5-5.8s-.16-3.94-.5-5.8ZM9.6 15.4V8.6l6.4 3.4-6.4 3.4Z"
                />
              }
            />
          </div>
        </div>

        {/* --- Column 2: Quick navigation links --- */}
        <div>
          <h4 className="text-sm uppercase tracking-wide text-white/60 mb-3">Explore</h4>
          <ul className="space-y-2 text-white/80">
            {/* Use NavLink for active styles if desired */}
            <li><NavLink to="/" className="hover:text-indigo-300">Home</NavLink></li>
            <li><NavLink to="/ingredients" className="hover:text-indigo-300">Ingredients</NavLink></li>
            <li><NavLink to="/pantry" className="hover:text-indigo-300">Pantry</NavLink></li>
            <li><NavLink to="/planner" className="hover:text-indigo-300">Meal Planner</NavLink></li>
            <li><NavLink to="/dashboard" className="hover:text-indigo-300">My Dashboard</NavLink></li>
          </ul>
        </div>

        {/* --- Column 3: Subscribe box (Premium upsell) --- */}
        <div>
          <h4 className="text-sm uppercase tracking-wide text-white/60 mb-3">Premium</h4>

          {/* Card look: subtle glass with border */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/80">
              Unlock smart meal plans, nutrition insights, and pro tips.
            </p>

            {/* Inline form: email + button */}
            <form onSubmit={onSubscribe} className="mt-3 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-10 flex-1 px-3 rounded-lg bg_WHITE/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                Subscribe
              </button>
            </form>

            {/* Small reassurance blurb */}
            <p className="mt-2 text-xs text_white/50">
              We’ll only email important updates. Cancel anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Lower footer: copyright + legal */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-white/60 flex items-center justify-between">
          <span>© {new Date().getFullYear()} MealSearch</span>
          <span>
            <a className="hover:text-white" href="#">Terms</a> ·{" "}
            <a className="hover:text-white" href="#">Privacy</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/**
 * SocialIcon
 * - `svg`: the <path> or SVG content (we pass it in so it’s flexible)
 */
function SocialIcon({ label, href, svg }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition"
    >
      {/* The icon itself (using currentColor so it inherits text color) */}
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        {svg}
      </svg>
    </a>
  );
}

