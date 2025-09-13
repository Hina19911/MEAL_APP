## 🎥 Demo Video

[![Watch the video](https://img.youtube.com/vi/aL0yXuBvdkY/0.jpg)](https://www.youtube.com/watch?v=aL0yXuBvdkY)

# MealSearch

A sleek **React + Vite** app for discovering meals from **TheMealDB**, liking favorites, filtering by pantry ingredients, planning meals on a calendar, and logging in (demo login by default, optional Firebase Email/Password). Clean dark UI with **Tailwind CSS**, a simple toast, and a polished header/footer.

> **Demo Login (built-in):**  
> **Username:** `user`  ·  **Password:** `password`  
> (No backend needed. You can also enable Firebase Auth for real users.)

---

## ✨ Features

- **Browse & Search**
  - Search meals by **ingredient** (TheMealDB).
  - **Ingredients** page → tap any item to see **Meals by Ingredient**.
  - **Meal Details**: image, category, area, tags, instructions, ingredients & measures, links (YouTube, Source).

- **Likes & Dashboard**
  - Like recipes anywhere → see them on **My Dashboard**.
  - Delete liked items, jump to details.

- **Pantry (multi-select filter)**
  - Add ingredients to your **Pantry** and see meals you can cook that match.
  - Beautiful empty-state banner when nothing is selected.

- **Meal Planner (calendar)**
  - Month view with **+ Add** on each day.
  - Choose meals from your **Liked** list; remove with ✕.
  - Saved in **localStorage**.

- **Auth**
  - **Demo login** (local, no server).
  - Optional **Firebase Email/Password** (enable with env + a Firebase user).
  - **Protected routes** (e.g., Dashboard, Planner).

- **Polished UI/UX**
  - Tailwind-based dark theme.
  - Balanced header: search (left), brand+nav (center), dashboard & auth (right).
  - Footer with socials + basic “Subscribe to Premium” (toast UX).
  - Tiny **Toast** component for non-intrusive notifications.

- **(Optional) AI “Inspire me”**
  - Small prompt box backed by a tiny Node/Express endpoint.
  - **Mock mode** for zero-cost dev (no API calls).

---

## 🧱 Tech Stack

- **React 18 + Vite**
- **React Router**
- **Tailwind CSS**
- **TheMealDB API**
- **localStorage** (likes, planner, pantry)
- **(Optional)** Firebase (Auth + Realtime Database init only; DB not required)
- **(Optional)** Node/Express server for AI endpoint (mockable)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **npm**
- (Optional) A **Firebase** project if you want real email/password auth.

### 1) Clone & install
```bash
git clone https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
cd <REPO_NAME>
npm install
src/
  components/
    Header.jsx            # search (L), brand+nav (C), dashboard+auth (R)
    Footer.jsx            # socials + Premium subscribe (toast)
    Toast.jsx
    Card.jsx, MealCard.jsx
    BackupPanel.jsx       # optional (export/import JSON) – can add later
  layouts/
    MainLayout.jsx        # wraps pages with Header + Footer
  utils/
    likes.js              # localStorage helpers for likes
    mealPlan.js           # localStorage helpers for calendar
  views/
    Home.jsx
    Ingredients.jsx
    MealsByIngredient.jsx
    MealDetails.jsx
    Pantry.jsx            # pantry selection + result grid (if you added this view)
    MealPlanner.jsx       # calendar view
    Dashboard.jsx         # liked recipes
    Login.jsx             # centered login form
  contexts/ or context/
    AuthContext.jsx       # demo login + optional Firebase
  lib/
    firebase.js           # reads VITE_ env vars (safe placeholders ok)
server/                   # (optional) Node API for AI "Inspire me"
  index.js
  .env.example
  🧪 Scripts
  npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview built app locally
cd server
npm i
# Mock mode (no external calls):
MOCK_AI=1 PORT=8787 node index.js
🙌 Credits

Data by TheMealDB (https://www.themealdb.com)
