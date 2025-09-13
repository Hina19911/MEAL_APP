// src/views/Dashboard.jsx
// Purpose: Show the user's liked recipes with quick actions.
// - Uses MainLayout so Header/Footer render consistently
// - "Plan meals" link to the Meal Planner
// - Red "Delete" button to remove a meal from Likes (localStorage)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";         //  Footer is included
import { getLikedMeals, toggleLike } from "../utils/likes"; //  toggleLike removes when already liked

export default function Dashboard() {
  // Local state of liked recipes
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    // Load liked meals on mount
    setLiked(getLikedMeals());

    // Sync if likes change in another tab/window
    const onStorage = (e) => {
      if (e.key === "likedMeals") setLiked(getLikedMeals());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Delete handler: use toggleLike (since the item is already liked, this will remove it)
  function handleDelete(meal) {
    toggleLike({
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
    });
    // Refresh local list from storage
    setLiked(getLikedMeals());
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4">
        {/* Page header: title + actions */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Your Liked Recipes
          </h1>

          {/* Right-side action buttons */}
          <div className="flex items-center gap-2">
            <Link
              to="/planner"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md transition"
              title="Open Meal Planner"
            >
              Plan meals
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 font-medium transition"
              title="Find more meals"
            >
              + Find more
            </Link>
          </div>
        </header>

        {/* Empty state */}
        {!liked.length ? (
          <p className="mt-6 text-white/70">
            You haven’t liked any recipes yet. Browse meals and tap{" "}
            <strong>Like</strong> to add them here.
          </p>
        ) : (
          // Grid of liked recipe cards
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {liked.map((m) => (
              <div
                key={m.idMeal}
                className="rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow"
              >
                {/* Clickable area (image + title) → goes to meal details */}
                <Link
                  to={`/meal/${m.idMeal}`}
                  className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  title={m.strMeal}
                >
                  <img
                    src={m.strMealThumb}
                    alt={m.strMeal}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-white font-semibold leading-snug group-hover:text-indigo-200">
                      {m.strMeal}
                    </h3>
                  </div>
                </Link>

                {/* Card footer: actions */}
                <div className="px-3 pb-3 flex items-center justify-between">
                  <Link
                    to={`/meal/${m.idMeal}`}
                    className="text-sm text-indigo-300 hover:text-indigo-200 underline"
                    title="View recipe"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(m)}
                    className="text-sm px-2 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium transition"
                    title="Remove from liked"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
