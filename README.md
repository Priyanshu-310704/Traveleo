✈️ Travel Budget Tracker

A full-stack MERN application to plan trips, track expenses, and stay within budget

🌟 Overview

Travel Budget Tracker is a modern full-stack web application that helps users plan trips, set budgets, track expenses, and gain smart insights about their spending.

Unlike basic expense trackers, this app is trip-centric:

Each trip has its own budget

Expenses are grouped by categories

Only the active trip is shown on the dashboard

The UI clearly highlights over-budget scenarios

Built with clean UX, robust backend logic, and scalable architecture.

🚀 Features
🔐 Authentication

Secure JWT-based login & signup

Protected routes (Dashboard, Trips, Trip Details)

User-specific data isolation

🧳 Trips Management

Create trips with:

Title

Destination

Start & End dates

Budget (mandatory)

Automatic trip status:

Upcoming

Active

Completed

Delete trips (with cascading removal of budget & expenses)

📊 Smart Dashboard

Shows only the active trip

If no active trip → clean placeholder UI

Summary cards:

Total Budget

Total Spent

Remaining / Over-budget

Visual budget usage bar:

Never overflows UI

Turns red when over budget

Percentage capped at 100% visually

Expense analytics:

Pie chart (category distribution)

Bar chart (category-wise spending)

Smart spending insights

💸 Expense Tracking

Add expenses per trip

Assign categories

Filter expenses by category

Category-wise analytics

Real-time dashboard updates (no refresh needed)

🗂️ Categories

Default categories created on signup

Food

Transport

Stay

Shopping

Entertainment

Miscellaneous

Users can add custom categories

Categories are global per user, reusable across trips

📄 Trip Details Page

Dedicated page for each trip

Budget vs spent vs remaining summary

Full expense table

Add expense via modal

Filter by category

Clean, glassmorphic UI matching dashboard theme

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

Recharts (charts & analytics)

Framer Motion (animations)

React Router DOM

Axios

Backend

Node.js

Express.js

PostgreSQL

JWT Authentication

bcrypt (password hashing)

🧱 Architecture
Frontend (React)
│
├── Pages
│   ├── Dashboard
│   ├── Trips
│   ├── TripDetails
│   ├── Login / Signup
│
├── Components
│   ├── Navbar
│   ├── NewTripModal
│   ├── AddExpenseModal
│
├── API Layer (Axios)
│
Backend (Express)
│
├── Routes
│   ├── auth
│   ├── trips
│   ├── budgets
│   ├── expenses
│   ├── categories
│
├── Middleware
│   ├── authMiddleware
│
└── PostgreSQL Database

🗃️ Database Design
Core Tables

users

trips

budgets

expenses

categories

Key Design Decisions

Budget stored in a separate table

Categories linked to users, not trips

Expenses linked to trip + category

Transaction-based trip + budget creation

🔐 Security

Password hashing using bcrypt

JWT authentication middleware

User-scoped queries (no data leakage)

Protected frontend routes

🎨 UX Highlights

Glassmorphism UI

Smooth transitions with Framer Motion

Clear over-budget warnings

Clean empty states

Mobile-responsive layout

⚙️ Setup Instructions
1️⃣ Clone the repository
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

🧪 Sample Data (Optional)

A seed script is available to populate:

Sample users

Trips

Budgets

Categories

Expenses

Perfect for demos & testing.

🧠 Learning Outcomes

This project demonstrates:

Full-stack MERN development

RESTful API design

Auth flows & protected routes

Complex state management

UX-driven UI decisions

Real-world budgeting logic

🚧 Future Enhancements

Export expenses as CSV/PDF

Budget alerts & notifications

Multi-currency support

Trip sharing with collaborators

Offline support (PWA)

👨‍💻 Author

Ankush Jamuar
📍 India
💻 Full-Stack Developer | MERN | UI/UX Enthusiast

Built with attention to detail, real-world logic, and user-first design.