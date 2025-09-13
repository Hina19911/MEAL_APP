import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import LoadingIndicator from '../components/LoadingIndicator'
// ⭐ import the like helpers
import { isLiked, toggleLike } from '../utils/likes'
 //  toast: import
import Toast from '../components/Toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function MealDetails() {
  const { id } = useParams()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // ⭐ track liked state for this meal
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchMealDetails = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`)
        const data = await response.json()

        // Guard: MealDB returns { meals: null } if not found
        const found = data?.meals?.[0] ?? null
        setMeal(found)

        // ⭐ once we have the meal, compute initial like state
        if (found?.idMeal) {
          setLiked(isLiked(found.idMeal))
        } else {
          setLiked(false)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching meal details:', error)
        setError('Error fetching meal details')
        setLoading(false)
      }
    }

    fetchMealDetails()
  }, [id])
   // ⭐ toast: helper
   function showToast(message, tone = "success", ms = 1500) {
    setToastMsg(message)
    setToastTone(tone)
    setToastShow(true)
    // auto-hide
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToastShow(false), ms)
  }

  function handleToggleLike() {
    if (!meal) return
    const nowLiked = toggleLike({
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
    })
    setLiked(nowLiked)
    // ⭐ toast: different messages for add/remove
    showToast(nowLiked ? "Added to Dashboard!" : "Removed from Dashboard", nowLiked ? "success" : "info")
  }

  // ⭐ handler to toggle like and update UI
  function handleToggleLike() {
    if (!meal) return
    const nowLiked = toggleLike({
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
    })
    setLiked(nowLiked)
  }

  return (
    <MainLayout>
      <div className='max-w-2xl mx-auto'>
        {loading && <LoadingIndicator />}
        {error && <p className="text-center py-8 text-red-500">{error}</p>}

        {!loading && !error && meal && (
          <div className="p-4">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-4">{meal.strMeal}</h2>

            {/* Image */}
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full mb-4 rounded-lg shadow"
            />

            {/* Meta info */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
              <h3 className="text-xl">
                <span className='font-bold'>Category</span>: {meal.strCategory}
              </h3>
              <h3 className="text-xl">
                <span className='font-bold'>Area</span>: {meal.strArea}
              </h3>
              <h3 className="text-xl">
                <span className='font-bold'>Tags</span>: {meal.strTags || '—'}
              </h3>
            </div>

            {/* Instructions */}
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">Instructions:</h3>
              <p className="leading-relaxed whitespace-pre-line">{meal.strInstructions}</p>
            </div>

            {/* Ingredients & Measures */}
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="mb-4 flex-1">
                <h3 className="text-xl font-bold mb-2">Ingredients:</h3>
                <ul className="list-disc list-inside">
                  {Object.keys(meal)
                    .filter(key => key.startsWith('strIngredient') && meal[key])
                    .map(key => (
                      <li key={key}>{meal[key]}</li>
                    ))}
                </ul>
              </div>
              <div className="mb-4 flex-1">
                <h3 className="text-xl font-bold mb-2">Measures:</h3>
                <ul className="list-disc list-inside">
                  {Object.keys(meal)
                    .filter(key => key.startsWith('strMeasure') && meal[key])
                    .map(key => (
                      <li key={key}>{meal[key]}</li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {/* Watch on YouTube */}
              {meal.strYoutube && (
                <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                    Watch on YouTube
                  </button>
                </a>
              )}

              {/* ⭐ Like button: Tailwind styles toggle with state */}
              <button
                onClick={handleToggleLike}
                aria-pressed={liked}
                className={[
                  'px-4 py-2 rounded-lg shadow-md transition font-medium',
                  liked
                    ? 'bg-pink-500 hover:bg-pink-600 text-white'
                    : 'bg-white hover:bg-pink-50 text-pink-600 border border-pink-300'
                ].join(' ')}
                title={liked ? 'Remove from Dashboard' : 'Add to Dashboard'}
              >
                {liked ? '♥ Liked' : '♡ Like'}
              </button>

              {/* Source link */}
              {meal.strSource && (
                <a
                  href={meal.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline hover:text-indigo-800"
                >
                  View Original Source
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
