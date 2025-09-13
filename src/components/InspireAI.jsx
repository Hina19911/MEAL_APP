// src/components/InspireBox.jsx
import React, { useState } from 'react'

export default function InspireBox() {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function ask() {
    if (!prompt.trim()) return
    setLoading(true); setError(''); setAnswer('')
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const raw = await res.text()
      const data = raw ? JSON.parse(raw) : {}
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
      setAnswer(data?.text || '')
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    ask()
  }

  return (
    <section className="max-w-3xl mx-auto mt-6 px-4">
      <div
        className="
          rounded-2xl border border-white/10
          bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-indigo-900/40
          backdrop-blur shadow-xl
          p-6
        "
      >
        {/* Big heading in SAME card */}
        <h2
          className="
            text-3xl md:text-4xl font-extrabold tracking-tight mb-4
            bg-clip-text text-transparent
            bg-[linear-gradient(90deg,#fde047,#22c55e,#60a5fa,#a78bfa)]
          "
        >
          HUNGRY FOR MORE!!
        </h2>

        {/* Prompt form */}
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask for quick ideas… e.g., 15-min vegetarian dinner"
            className="
              flex-1 h-11 px-4
              rounded-xl
              bg-white/5 text-white placeholder-white/60
              border border-white/10
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
            "
          />
          <button
            type="submit"
            disabled={loading}
            className="
              h-11 px-5 rounded-xl
              bg-indigo-500 hover:bg-indigo-600
              text-white font-semibold
              disabled:opacity-60 transition
            "
          >
            {loading ? 'Thinking…' : 'Ask'}
          </button>
        </form>

        {/* Error / Answer */}
        {error && <p className="mt-3 text-rose-400">{error}</p>}
        {answer && (
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-indigo-100">
            {answer}
          </div>
        )}
      </div>
    </section>
  )
}
