# 🎬 Netflix Clone

A full-stack Netflix-inspired streaming landing page built with **React + TVMaze API** for the frontend and **Node.js + Express + MySQL (Aiven)** for the backend.

---

## ✨ Features

- 🎭 **Live TV Show Data** via free [TVMaze API](https://www.tvmaze.com/api) — no API key required
- 🔥 Multiple genre rows: Trending, Drama, Action, Comedy, Horror, Crime, Sci-Fi, Romance
- 🎬 **YouTube Trailer Modal** — click any show to watch its trailer
- 📱 **Fully Responsive** — tested from iPhone SE (375px) to 4K (2560px)
- 🍔 **Hamburger menu** on mobile, full nav on desktop
- 🌟 **Hero Banner** with random trending show on every load
- 🔐 **Auth System** — Register & Login with MySQL (Aiven) + bcrypt
- ✅ **Field-level validation** with per-field blur errors on both forms
- 🔑 **Password strength meter** on register page
- ♿ **Accessible** — proper ARIA labels, keyboard navigation, focus trap in modal

---

## 📁 Project Structure

```
Netflix-Clone/
  frontend/               React app (TVMaze API + UI)
    public/
      index.html
    src/
      components/
        Navbar.js / .css
        Banner.js / .css
        Row.js / .css
        ShowCard.js / .css
        TrailerModal.js / .css
        LoadingSkeleton.js / .css
      hooks/
        useFetch.js         Custom hook — fetch + cleanup + loading/error
      pages/
        Home.js / .css
        Login.js / .css
        Register.js / .css
      utils/
        tvmaze.js           API endpoints + normalizeShow helper
      App.js / .css
      index.js / .css
    .env                   REACT_APP_BACKEND_URL
    package.json

  backend/                Express API (Auth endpoints)
    routes/
      auth.js             POST /api/register, POST /api/login, GET /api/health
    db/
      connection.js       MySQL2 pool (Aiven SSL)
      init.js             Auto-create User table
    middleware/
      validate.js         express-validator rules
    server.js             Entry point
    .env                  Database credentials (fill in!)
    package.json

  README.md
```

---

## 🚀 Prerequisites

- **Node.js** v18 or above
- **npm** v9 or above
- An **[Aiven](https://aiven.io)** account with a MySQL service (free tier works)

---

## ⚙️ Setup & Run

### 1. Clone / Enter the project

```powershell
cd C:\Users\Harsh\Netflix-Clone
```

### 2. Install Frontend Dependencies

```powershell
cd frontend
npm install
```

### 3. Install Backend Dependencies

```powershell
cd ..\backend
npm install
```

---

## 🌐 Run the Frontend

```powershell
cd frontend
npm start
```

Opens at **http://localhost:3000**

---

## 🔧 Run the Backend

### Step 1 — Fill in Aiven credentials

Open `backend/.env` and add your Aiven MySQL values:

```env
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=your-password-here
DB_NAME=defaultdb

PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Where to find these values:**
1. Log in to [Aiven Console](https://console.aiven.io)
2. Click your MySQL service
3. Go to **Connection Information**
4. Copy Host, Port, User, Password, Database name

### Step 2 — Start the backend

```powershell
cd backend

# Development (auto-restart on file change):
npm run dev

# Production:
npm start
```

**You should see:**
```
🎬 Netflix Clone Backend — Starting up…
✅ Database: User table ready.
✅ Server running on http://localhost:5000
   Health check: http://localhost:5000/api/health
```

---

## 🔌 API Endpoints

### `GET /api/health`
Checks if the server and database are reachable.

**Response 200:**
```json
{
  "status": "ok",
  "message": "Netflix Clone API is running.",
  "database": "connected",
  "time": "2024-01-01T00:00:00.000Z"
}
```

---

### `POST /api/register`

**Body:**
```json
{
  "UserId":   "harshdev",
  "name":     "Harsh Sharma",
  "email":    "harsh@example.com",
  "phone":    "+91 98765 43210",
  "password": "MyPass1234"
}
```

**Success 201:**
```json
{
  "success": true,
  "message": "Registration successful! You can now sign in."
}
```

**Error 409 (duplicate UserId):**
```json
{
  "success": false,
  "message": "User ID \"harshdev\" is already taken."
}
```

**Error 409 (duplicate email):**
```json
{
  "success": false,
  "message": "An account with that email address already exists."
}
```

---

### `POST /api/login`

**Body:**
```json
{
  "UserId":   "harshdev",
  "password": "MyPass1234"
}
```

**Success 200:**
```json
{
  "success": true,
  "message": "Login successful. Welcome back!",
  "user": { "UserId": "harshdev", "name": "Harsh Sharma" }
}
```

**Error 401:**
```json
{
  "success": false,
  "message": "Invalid User ID or password."
}
```

---

## 🛠️ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Cannot connect to server` on login/register | Make sure `npm run dev` is running in `/backend` |
| `Access denied for user` | Check DB_USER and DB_PASSWORD in `backend/.env` |
| `ECONNREFUSED` | Verify DB_HOST and DB_PORT match Aiven console exactly |
| `ER_ACCESS_DENIED_ERROR` | Aiven password is wrong or user has no permissions |
| Table doesn't exist | The server auto-creates it on startup — check backend console for errors |
| CORS error in browser | Confirm `FRONTEND_URL` in `backend/.env` matches your React dev server port |
| `npm start` shows port in use | Another process is using port 3000 or 5000 — change `PORT` in `.env` |
| Trailer not loading | YouTube search iframes require an internet connection and may vary by region |

---

## 📱 Responsive Breakpoints

| Device          | Width       | Cards/Row | Notes                        |
|-----------------|-------------|-----------|------------------------------|
| iPhone SE       | 375px       | 2         | Touch swipe for rows         |
| iPhone 14       | 390px       | 2         | Touch swipe for rows         |
| iPad            | 768px       | 3–4       | Touch swipe for rows         |
| Laptop          | 1280px      | 4–5       | Arrow buttons visible        |
| Desktop         | 1440px      | 5–6       | Arrow buttons visible        |
| 4K              | 2560px      | 6         | Max-width containers center  |

---

## 🧰 Tech Stack

| Layer     | Technology                |
|-----------|--------------------------|
| Frontend  | React 18, React Router v6 |
| Styling   | Vanilla CSS (mobile-first)|
| HTTP      | Axios                    |
| API Data  | TVMaze API (free, no key)|
| Backend   | Node.js, Express 4       |
| Database  | MySQL (Aiven cloud)      |
| Auth      | bcrypt (password hashing)|
| Validation| express-validator        |

---

## 📜 License

This project is for educational purposes only. Netflix is a trademark of Netflix, Inc.
