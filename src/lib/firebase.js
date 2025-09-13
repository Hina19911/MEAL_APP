
// src/lib/firebase.js
// Purpose: Initialize Firebase exactly once and export Auth + Realtime DB.
// - Reads config from Vite env (must start with VITE_)
// - Avoids double init with getApps()/getApp() (important in Vite HMR)
// - Optional diagnostics are executed *after* config is defined to prevent
//   "Cannot access 'firebaseConfig' before initialization" errors.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, serverTimestamp } from "firebase/database";

// 1) Define the config FIRST (so nothing touches it before it exists)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, // ✅ RTDB URL
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 2) Initialize the app exactly once (handles Vite hot reload nicely)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 3) Export the services you need
export const auth = getAuth(app);
export const db = getDatabase(app);

// 4) Optional diagnostics (safe & optional)
//    Turn on by setting VITE_FIREBASE_DEBUG=1 in your .env
if (import.meta.env.VITE_FIREBASE_DEBUG === "1") {
  try {
    // Now it's safe to reference firebaseConfig because it's already declared
    // eslint-disable-next-line no-console
    console.log("[Firebase] project:", firebaseConfig.projectId);

    // Tiny RTDB write ping (will fail if rules disallow)
    set(ref(db, "diagnostics/boot"), { ts: serverTimestamp() })
      .then(() => console.log("[Firebase] RTDB write OK"))
      .catch((e) => console.warn("[Firebase] RTDB write failed:", e?.message || e));
  } catch (e) {
    console.warn("[Firebase] Debug block error:", e?.message || e);
  }
}
