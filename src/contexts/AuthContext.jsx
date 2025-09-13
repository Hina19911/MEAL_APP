// src/context/AuthContext.jsx
// Simple auth context:
// - Demo login: username "user" + password "password" (stored in localStorage)
// - Firebase login: any other email/password (if you added a user in Firebase Auth)
// - logout() clears demo or signs out Firebase
//
// NOTE: This avoids any Realtime Database logic entirely.

import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'

const AuthContext = createContext(null)
const DEMO_KEY = 'authUser_demo' // localStorage key for demo session

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)           // demo user or Firebase user
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1) Try restoring demo session first (so we don't flash UI)
    const raw = localStorage.getItem(DEMO_KEY)
    if (raw) {
      try {
        const saved = JSON.parse(raw)
        if (saved?.provider === 'demo') {
          setUser(saved)
          setIsAuthenticated(true)
          setLoading(false)
          return
        }
      } catch {}
    }

    // 2) Otherwise, listen for Firebase session
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser || null)
      setIsAuthenticated(!!fbUser)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // Login:
  // - "user" + "password" → demo mode, no server calls
  // - else → Firebase email/password
  async function login(identifier, password) {
    if (!identifier || !password) {
      return Promise.reject(new Error('Please enter username/email and password'))
    }

    const id = String(identifier).trim().toLowerCase()

    // ✅ DEMO login — keep working exactly as you wanted
    if (id === 'user' && password === 'password') {
      const demoUser = {
        uid: 'demo-uid',
        email: 'user@demo.local',
        displayName: 'Demo User',
        provider: 'demo',
      }
      localStorage.setItem(DEMO_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      setIsAuthenticated(true)
      return demoUser
    }

    // 🔐 Firebase Email/Password for anything else
    const cred = await signInWithEmailAndPassword(auth, identifier, password)
    return cred.user
  }

  // Logout: clear demo or sign out Firebase
  async function logout() {
    if (user?.provider === 'demo') {
      localStorage.removeItem(DEMO_KEY)
      setUser(null)
      setIsAuthenticated(false)
      return
    }
    try { await signOut(auth) } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const value = { user, isAuthenticated, login, logout, loading }

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
