
import React, { useMemo, useState, useEffect } from "react"

export default function PantrySidebar({
  ingredients,
  selected,
  onChangeSelected
}) {
  // Local search text to filter the list visually
  const [query, setQuery] = useState("")
  // Persist selection across reloads
  useEffect(() => {
    const saved = localStorage.getItem("pantrySelected")
    if (saved && typeof onChangeSelected === "function") {
      try {
        const arr = JSON.parse(saved)
        if (Array.isArray(arr)) onChangeSelected(arr)
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save whenever selection changes
  useEffect(() => {
    localStorage.setItem("pantrySelected", JSON.stringify(selected))
  }, [selected])

  // Filter ingredients by search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ingredients
    return ingredients.filter(i =>
      i.strIngredient?.toLowerCase().includes(q)
    )
  }, [ingredients, query])

  function toggle(ing) {
    const exists = selected.includes(ing)
    const next = exists
      ? selected.filter(s => s !== ing)
      : [...selected, ing]
    onChangeSelected(next)
  }

  function clearAll() {
    onChangeSelected([])
  }

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-gray-200 p-4 bg-green-400">
      <h3 className="text-lg font-semibold mb-3">Pantry</h3>

      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search ingredients..."
        className="w-full mb-3 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Selected summary + clear */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          Selected: <strong>{selected.length}</strong>
        </span>
        {selected.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-indigo-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Scrollable list */}
      <div className="max-h-[60vh] overflow-auto pr-1">
        <ul className="space-y-1">
          {filtered.map(item => {
            const name = item.strIngredient
            const checked = selected.includes(name)
            return (
              <li key={name} className="flex items-center gap-2">
                <input
                  id={`ing-${name}`}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(name)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`ing-${name}`}
                  className={`text-sm cursor-pointer ${checked ? "font-medium text-gray-900" : "text-gray-700"}`}
                >
                  {name}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
