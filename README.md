# ✈️ Travel Budget Tracker

A full-stack **MERN-style (React + Node + PostgreSQL)** application that helps users **plan trips, set budgets, track expenses, and visualize spending** — all with a clean, modern UI and real-world budgeting logic.

---

## 🌟 Overview

**Travel Budget Tracker** is a trip-centric expense management platform.

Instead of tracking random expenses, users:
- Create trips with a **fixed budget**
- Add expenses under **categories**
- See **only the active trip** on the dashboard
- Instantly know when they are **over budget**

The app focuses heavily on **UX clarity**, **data integrity**, and **scalable backend design**.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login & signup
- Protected routes
- User-specific data isolation

---

### 🧳 Trip Management
- Create trips with:
  - Title
  - Destination
  - Start & end dates
  - Mandatory budget
- Automatic trip status:
  - **Upcoming**
  - **Active**
  - **Completed**
- Delete trips (budgets & expenses removed safely)

---

### 📊 Smart Dashboard
- Shows **only the active trip**
- If no active trip → clean placeholder UI
- Summary cards:
  - Budget
  - Spent
  - Remaining / Over-budget
- Budget usage bar:
  - Never overflows UI
  - Visually capped at 100%
  - Turns red when over budget
- Charts:
  - Pie chart (expense distribution)
  - Bar chart (category-wise spending)
- Smart spending insights

---

### 💸 Expense Tracking
- Add expenses per trip
- Assign categories
- Filter expenses by category
- Real-time UI updates (no refresh)

---

### 🗂️ Categories
- Default categories auto-created on signup:
  - Food
  - Transport
  - Stay
  - Shopping
  - Entertainment
  - Miscellaneous
- Categories are **global per user**
- Reusable across all trips

---

### 📄 Trip Details Page
- Dedicated page per trip
- Budget summary
- Expense table
- Category filtering
- Add expense modal
- UI consistent with dashboard theme

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Recharts
- Framer Motion
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt (password hashing)

---

## 🧱 Architecture

Frontend (React)
│
├── Pages
│ ├── Dashboard
│ ├── Trips
│ ├── TripDetails
│ ├── Login / Signup
│
├── Components
│ ├── Navbar
│ ├── NewTripModal
│ ├── AddExpenseModal
│
├── API Layer (Axios)
│
Backend (Express)
│
├── Routes
│ ├── auth
│ ├── trips
│ ├── budgets
│ ├── expenses
│ ├── categories
│
├── Middleware
│ ├── authMiddleware
│
└── PostgreSQL Database


---

## 🗃️ Database Design

### Tables
- `users`
- `trips`
- `budgets`
- `expenses`
- `categories`

### Design Decisions
- Budget stored in a **separate table**
- Categories linked to **users**, not trips
- Expenses linked to **trip + category**
- Trip + budget created inside a **transaction**

---

## 🔐 Security
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- User-scoped queries

---

## 🎨 UX Highlights
- Glassmorphism UI
- Smooth animations
- Clear empty states
- Over-budget visual warnings
- Mobile-responsive design

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/travel-budget-tracker.git
cd travel-budget-tracker

2️⃣ Backend Setup
cd backend
npm install

Create .env file:

PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/travel_budget
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

Run backend:
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🧪 Sample Data

Optional seed script available to populate:

Users
Trips
Budgets
Categories
Expenses

🧠 Learning Outcomes

This project demonstrates:

Full-stack application design

REST API development

Authentication & authorization

State management & UX-driven UI

Real-world budgeting logic

Database transactions

🚧 Future Enhancements

Export expenses (CSV / PDF)

Budget alerts & notifications

Multi-currency support

Trip collaboration

Offline support (PWA)

👨‍💻 Author

Ankush Jamuar
Full-Stack Developer | MERN | UI/UX Focused

Built with real-world logic, clean UX, and scalable architecture.