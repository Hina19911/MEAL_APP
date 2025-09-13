// Simple localStorage CRUD for the meal planner
const KEY = "mealPlan"; // { "YYYY-MM-DD": [{idMeal, strMeal, strMealThumb, _id}], ... }

export function loadPlan() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export function savePlan(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

export function addMealToDate(dateISO, meal) {
  const all = loadPlan();
  const prevDay = all[dateISO] || [];
  const day = [...prevDay]; // immutability

  const name = (meal.strMeal || "").trim();
  if (!name) return all;

  // Case-insensitive duplicate check (by idMeal or name)
  const exists = day.some(m =>
    (m.idMeal && meal.idMeal && m.idMeal === meal.idMeal) ||
    (m.strMeal && m.strMeal.toLowerCase() === name.toLowerCase())
  );
  if (exists) return all;

  day.push({
    idMeal: meal.idMeal ?? null,
    strMeal: name,
    strMealThumb: meal.strMealThumb ?? null,
    // unique id for React list keys if needed
    _id: meal._id ?? `c_${Date.now()}_${Math.random().toString(36).slice(2,7)}`
  });

  const updated = { ...all, [dateISO]: day };
  savePlan(updated);
  return updated;
}

export function removeMealFromDate(dateISO, idx) {
  const all = loadPlan();
  const prevDay = all[dateISO] || [];
  const day = prevDay.filter((_, i) => i !== idx); // immutability
  const updated = { ...all };
  if (day.length) updated[dateISO] = day; else delete updated[dateISO];
  savePlan(updated);
  return updated;
}
