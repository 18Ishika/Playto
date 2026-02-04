# Playto

# 🚀 Playto Community Feed Prototype

A high-performance **community feed system** built using **Django REST Framework** and **React**.
This project focuses on solving real backend challenges like **N+1 queries, concurrency issues, and complex leaderboard aggregation**, while keeping the frontend clean and responsive.

---

## 🌐 Live Demo

👉 [Add deployed link here]

---

## 🛠 Tech Stack

**Backend**

* Django
* Django REST Framework

**Frontend**

* React (Vite)
* Tailwind CSS
* Lucide Icons

**Database**

* PostgreSQL (Production)
* SQLite (Development)

**State Management**

* React Hooks

**Live Updates**

* Background Polling

---

## ✨ Key Features & Technical Decisions

### 1️⃣ Threaded Discussions (Avoiding N+1 Queries)

Nested comments are supported with unlimited depth.

To avoid performance issues:

* Used `prefetch_related` for fetching related comments
* Implemented recursive serializers in DRF
* Rendered nested threads recursively in React

This ensures that the entire comment tree loads efficiently without triggering extra database queries.

---

### 2️⃣ Dynamic Leaderboard (Last 24h Karma)

The leaderboard shows **karma earned in the last 24 hours**, not a stored static value.

**How it works:**

* Uses Django’s `Sum()` with time-based filters
* Calculates karma dynamically from the `Like` model
* Indexes applied on timestamp and user fields for performance

This keeps the leaderboard accurate and scalable.

---

### 3️⃣ Handling Concurrency & Race Conditions

To prevent duplicate likes and incorrect karma:

* Added `UniqueTogether` constraint (User + Post/Comment)
* Used Django `F()` expressions
* Wrapped updates in atomic transactions

This guarantees data consistency even under high traffic.

---

### 4️⃣ Background Data Sync

To keep the feed updated:

* Implemented polling every 30 seconds
* No UI interruption during refresh
* Loading indicator only on first load

This gives a near real-time experience without WebSockets.

---

## 📥 Local Setup

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Tests

To test the karma and post logic:

```bash
python manage.py test posts.tests
```

---

## 📄 Project Explanation

Detailed technical explanations are available in:

👉 `EXPLAINER.md`

Includes:

* Database schema design
* Thread modeling
* Query optimization
* Leaderboard logic
* AI-assisted development review

---



---

