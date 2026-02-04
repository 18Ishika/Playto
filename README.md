---

# 🚀 Playto – Community Feed Prototype

A high-performance **community feed system** built using **Django REST Framework** and **React**.

This project focuses on solving real backend challenges such as **N+1 queries, concurrency control, and complex leaderboard aggregation**, while maintaining a clean and responsive frontend.

---

## 🌐 Live Demo

In progress

---

## 🛠 Tech Stack

### Backend

* Django
* Django REST Framework

### Frontend

* React (Vite)
* Tailwind CSS
* Lucide Icons

### Database

* PostgreSQL (Production)
* SQLite (Development)

### State Management

* React Hooks

### Live Updates

* Background Polling

---

## ✨ Key Features & Technical Decisions

---

### 1️⃣ Threaded Discussions (N+1 Query Optimization)

Supports unlimited nested comments.

**Optimizations:**

* `prefetch_related` for bulk fetching
* Recursive DRF serializers
* Recursive rendering in React

**Result:**
Entire comment trees load efficiently with minimal database queries.

---

### 2️⃣ Dynamic Leaderboard (24-Hour Karma System)

The leaderboard displays **karma earned in the last 24 hours**.

**Implementation:**

* Django `Sum()` with time-based filters
* `Case/When` aggregations
* Indexed timestamp and user fields

**Design Choice:**
Karma is calculated dynamically from like history instead of being stored, ensuring accuracy and integrity.

---

### 3️⃣ Concurrency & Data Integrity

Prevents race conditions and duplicate likes.

**Techniques Used:**

* `UniqueTogether` constraint (User + Post/Comment)
* `F()` expressions
* Atomic transactions

**Result:**
Ensures consistent karma and prevents double-like scenarios under high load.

---

### 4️⃣ Background Data Synchronization

Keeps the feed updated without disrupting user experience.

**Features:**

* Polling every 30 seconds
* Smooth background refresh
* Loader only on initial load

Provides near real-time updates without WebSocket complexity.

---

## 📥 Local Setup

---

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate    # Mac/Linux
venv\Scripts\activate       # Windows

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

## ▶️ How to Run

Open two terminals:

### Terminal 1 (Backend)

```bash
python manage.py runserver
```

### Terminal 2 (Frontend)

```bash
npm run dev
```

Then open:

```
http://localhost:5173
```

---

For more details check out :

👉 `EXPLAINER.md`


---


