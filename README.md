# Personal Fitness Tracker

A full-stack web application for tracking workout sessions, exercises, and sets. Built to practice real-world backend and frontend development while creating a tool that can be used during workouts.



---

## Features

### Workout Sessions
- Create workout sessions
- Edit session split, date, and notes
- Delete sessions
- View all past workouts
- Display exercise count per session

### Exercises
- Add exercises to a session
- Edit exercise names
- Delete exercises
- Reorder exercises within a workout

### Sets
- Add sets to exercises
- Edit reps, weight, time, and intensity
- Delete sets

### User Experience
- Optimistic UI updates for faster interactions
- Offline action queue that retries when connection returns
- Mobile-friendly layout for use at the gym
- Delete confirmation modal to prevent accidental deletion

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- React
- Vercel (deployment)

### Backend
- FastAPI
- SQLAlchemy

### Database
- PostgreSQL (hosted on Render)

### Authentication
- Password login
- bcrypt password hashing
- Cookie-based authentication
- API protected with X-API-KEY

---

## Architecture

Data structure:


WorkoutSession
 -> ExerciseEntry
-> SetEntry


- A **WorkoutSession** contains multiple exercises.
- Each **ExerciseEntry** contains multiple sets.
- Each **SetEntry** stores workout metrics like reps, weight, time, and intensity.

---



## Installation

### Clone the repository


git clone https://github.com/YOUR_USERNAME/fitness-tracker.git

cd fitness-tracker


---

### Backend Setup

Install dependencies:


pip install -r requirements.txt


Run the FastAPI server:


uvicorn main:app --reload


---

### Frontend Setup

Install dependencies:


npm install


Run the development server:


npm run dev


---



## Deployment

Frontend:
- Deployed with **Vercel**

Backend:
- Hosted on **Render**

Database:
- **PostgreSQL on Render**

---



## Author

Built by **Skrunch** as a portfolio project while learning full-stack development.