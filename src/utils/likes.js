
//  localStorage helper for liked recipes.
// We store only the fields we need: idMeal, strMeal, strMealThumb.
// Stores liked meals in localStorage under "likedMeals".


const STORAGE_KEY = "likedMeals";

export function getLikedMeals() {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isLiked(idMeal) {
  return getLikedMeals().some((m) => m.idMeal === idMeal);
}

export function toggleLike(meal) {
  // meal should include: idMeal, strMeal, strMealThumb
  const current = getLikedMeals();
  const exists = current.some((m) => m.idMeal === meal.idMeal);

  const next = exists
    ? current.filter((m) => m.idMeal !== meal.idMeal)
    : [...current, { idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb }];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return !exists; // return the new liked state (true if just liked)
}
