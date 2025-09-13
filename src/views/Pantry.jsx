// src/views/Pantry.jsx
import React, { useEffect, useMemo, useState } from "react"
import MainLayout from "../layouts/MainLayout"
import LoadingIndicator from "../components/LoadingIndicator"
import PantrySidebar from "../components/PantrySidebar"
import MealCard from "../components/MealCard"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function Pantry() {
  // All ingredients (for the sidebar)
  const [ingredients, setIngredients] = useState([])
  // Which ingredients the user checked
  const [selected, setSelected] = useState([])
  // Meals that match the selection (intersection)
  const [meals, setMeals] = useState([])
  // UI states
  const [loadingList, setLoadingList] = useState(false)
  const [loadingMeals, setLoadingMeals] = useState(false)
  const [error, setError] = useState("")

  // 1) Load ingredients once
  useEffect(() => {
    const load = async () => {
      setLoadingList(true)
      setError("")
      try {
        const res = await fetch(`${API_BASE_URL}/list.php?i=list`)
        const data = await res.json()
        setIngredients(data.meals || [])
      } catch (e) {
        console.error(e)
        setError("Failed to load ingredients")
      } finally {
        setLoadingList(false)
      }
    }
    load()
  }, [])

  // Helper: fetch meals for one ingredient
  async function fetchMealsForIngredient(ingName) {
    const res = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingName)}`)
    const data = await res.json()
    return data.meals || []
  }

  // 2) When selected changes, fetch in parallel and compute intersection by idMeal
  useEffect(() => {
    // If nothing selected: reset and stop
    if (selected.length === 0) {
      setMeals([])
      return
    }

    let ignore = false
    const run = async () => {
      setLoadingMeals(true)
      setError("")

      try {
        // Fetch all lists in parallel
        const lists = await Promise.all(selected.map(fetchMealsForIngredient))

        // Turn each list into a Map of idMeal -> meal
        const maps = lists.map(list => {
          const m = new Map()
          list.forEach(meal => m.set(meal.idMeal, meal))
          return m
        })

        // Start with IDs from the first map; keep only those present in all maps (intersection)
        const [first, ...rest] = maps
        let ids = new Set(first.keys())
        for (const m of rest) {
          ids = new Set([...ids].filter(id => m.has(id)))
        }

        // Build final array using the first map (any has same id/logo fields)
        const result = [...ids].map(id => first.get(id))

        if (!ignore) setMeals(result)
      } catch (e) {
        console.error(e)
        if (!ignore) setError("Failed to load meals for selected ingredients")
      } finally {
        if (!ignore) setLoadingMeals(false)
      }
    }

    run()
    return () => { ignore = true }
  }, [selected])

  // Display count: if nothing selected -> 0
  const canCookCount = useMemo(() => meals.length, [meals])

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row">
        {/* Sidebar: ingredients + selection */}
        <PantrySidebar
          ingredients={ingredients}
          selected={selected}
          onChangeSelected={setSelected}
        />

        {/* Main area */}
        <div className="flex-1 p-4 ">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Pantry</h2>
            <span className="text-sm text-gray-600">
              {selected.length === 0
                ? "Select ingredients to see what you can cook"
                : `You can cook ${canCookCount} ${canCookCount === 1 ? "meal" : "meals"}`}
            </span>
          </div>

          {/* Errors from either list/meals */}
          {error && <p className="text-red-500 mt-3">{error}</p>}

          {/* Loading indicators */}
          {(loadingList || loadingMeals) && <div className="mt-6"><LoadingIndicator /></div>}

          {/* Empty state when there are selections but no matches */}
          {!loadingMeals && selected.length > 0 && meals.length === 0 && !error && (
            <p className="text-gray-400 mt-6">No meals match all selected ingredients.</p>
          )}

          {/* Results grid */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {meals.map(meal => (
              <MealCard key={meal.idMeal} meal={meal} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
