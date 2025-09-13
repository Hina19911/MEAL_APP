// src/components/Header.jsx

// Purpose: Site header with left-aligned search, centered brand/nav, and right-aligned actions.
// - Search submits to /ingredient/:query
// - Right side shows "My Dashboard" and Log in / Log out (based on isAuthenticated)

import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext' 

export default function Header() {
  // --- local state for search input ---
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  // --- auth from context (demo or firebase) ---
  const { isAuthenticated, logout } = useAuth()

  // Handle search submit → navigate to /ingredient/:query
  const onSearch = (e) => {
    e.preventDefault()
    const query = q.trim()
    if (!query) return
    navigate(`/ingredient/${encodeURIComponent(query)}`)
    setQ('')
  }

  return (
    <header className="bg-[#0e1623] border-b border-white/10">
      {/* 3-column responsive grid:
          LEFT  = search
          CENTER= brand + nav
          RIGHT = dashboard + auth button */}
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 items-center gap-15">
        {/* LEFT: Search */}
        <form
          onSubmit={onSearch}
          className="order-2 md:order-1 md:justify-self-start w-full"
        >
          <div className="flex items-stretch max-w-[28rem]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search ingredients"
              placeholder="Search ingredients…"
              className="
                h-11 w-full
                px-4 rounded-l-xl
                bg-white/10 text-white placeholder-white/60
                border border-white/20
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
              "
            />
            <button
              type="submit"
              className="
                h-11 px-4 rounded-r-xl
                bg-indigo-500 hover:bg-indigo-600
                text-white font-medium
                border border-l-0 border-white/20
                transition
              "
            >
              Search
            </button>
          </div>
        </form>

        {/* CENTER: Brand + Nav */}
        <div className="order-1 md:order-2 md:justify-self-center w-full flex items-center justify-center gap-5">
          {/* Brand */}
          <Link to="/" className="text-white text-2xl font-extrabold tracking-tight">
            MealSearch
          </Link>

          {/* Nav links (hide on very small screens) */}
          <nav className="hidden sm:flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-indigo-400 font-semibold' : 'text-white hover:text-indigo-300'
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/ingredients"
              className={({ isActive }) =>
                isActive ? 'text-indigo-400 font-semibold' : 'text-white hover:text-indigo-300'
              }
            >
              Ingredients
            </NavLink>

            <NavLink
              to="/pantry"
              className={({ isActive }) =>
                isActive ? 'text-indigo-400 font-semibold' : 'text-white hover:text-indigo-300'
              }
            >
              Pantry
            </NavLink>

            <NavLink
              to="/planner"
              className={({ isActive }) =>
                isActive ? 'text-indigo-400 font-semibold' : 'text-white hover:text-indigo-300'
              }
            >
              Planner
            </NavLink>
          </nav>
        </div>

        {/* RIGHT: Dashboard + Auth */}
        <div className="order-3 md:justify-self-end w-full flex md:w-auto justify-end items-center gap-2">
          {/* Dashboard link (route is protected; it will redirect if not logged in) */}
          <Link
            to="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
          >
            My Dashboard
          </Link>

          {/* Log in / Log out button (this block was previously OUTSIDE return — now fixed) */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="px-3 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition ml-25 "
              title="Log out"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="px-3 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
              title="Log in"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
