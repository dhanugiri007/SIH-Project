# SAHYOG FLOW
### Cooperative Gig Services Platform — SIH 2026 | 

SAHYOG FLOW is an AI-powered cooperative workforce platform that converts a customer's plain-language service request into a structured, multi-task **Job Graph**, and dispatches those tasks fairly and transparently across a cooperative's worker pool — coordinating temporary multi-worker crews in real time, healing itself when a worker drops out, and settling payments per task automatically.

It's built for the unorganized gig-services sector (home cleaning, electrical, plumbing, carpentry) delivered through **worker cooperatives** rather than a single extractive platform — so the matching logic has to be fair and explainable, not just "highest rating wins."

---

## 1. The Problem

Home-services requests are rarely single-skill jobs. "Clean my kitchen, fix the leaking tap, and repair the cabinet hinge" needs a cleaner, a plumber, and a carpenter — coordinated as one job, not three disconnected bookings. Existing gig platforms:

- Don't decompose multi-trade requests automatically
- Match workers by rating/proximity alone, favoring already-popular workers and starving new/less-visible ones of opportunities
- Have no graceful recovery when a worker cancels or goes silent mid-job
- Give customers a single lump sum with no idea what they're actually paying for

## 2. Our Approach

| Problem | SAHYOG FLOW's Answer |
|---|---|
| Multi-trade requests aren't decomposed | An LLM converts natural language into a dependency-aware **Job Graph** of discrete, assignable tasks |
| Rating-only matching is unfair | A **skill + certification + availability + location + capacity**-aware dispatch engine, solved via constrained optimization (OR-Tools), scored across skill match, proximity, **fairness rotation**, and rating — rating is capped so it can never dominate the decision |
| No transparency in *why* someone got picked | Every assignment carries a stored, human-readable **explanation** with its full score breakdown, visible to both customer and worker |
| No recovery from mid-job failures | A **self-healing** layer detects reported failures, missed check-ins, and worker disconnects, reopens only the affected task, and re-dispatches it — without touching the rest of the crew |
| No visibility into cost | Automatic **itemised settlement** per task once a job completes, split into worker payout + cooperative commission |

---

## 3. Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Socket.IO client, React Router

**Backend:** Node.js, Express.js, Socket.IO
**Database:** MongoDB (Atlas)

**Cache / Real-time state:** Redis (WorkCell presence)

**Optimization Engine:** Python, OR-Tools (CP-SAT solver), Flask — run as an internal microservice

**AI / NLP:** Google Gemini API (free tier) — natural language → structured Job Graph

**Speech-to-Text:** Web Speech API (browser-native, free)

**Geolocation / Reverse Geocoding:** Browser Geolocation API + OpenStreetMap Nominatim (free)

**Auth:** JWT

**File Storage:** Local disk via Multer (completion proof photos/videos)



---

## 4. System Architecture

```
┌──────────────┐       REST + WebSocket          ┌───────────────────┐
│   React      │ ◄─────────────────────────────► │  Node/Express     │
│  Frontend    │                                 │  Backend          │
└──────────────┘                                 └─────┬──────┬──────┘
                                                       │      │
                                     ┌─────────────────┘      └───────────────┐
                                     ▼                                        ▼
                          ┌────────────────────────┐                 ┌────────────────────┐
                          │  MongoDB Atlas         │                 │  Redis             │
                          │  (jobs, tasks, users,  │                 │  (WorkCell live    │
                          │  ledger, settlements)  │                 │  presence)         │
                          └────────────────────────┘                 └────────────────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐          ┌────────────────────────┐
                          │  Gemini API         │          │  OR-Tools Solver       │
                          │  (Job Graph gen.)   │          │  (Flask microservice,  │
                          └─────────────────────┘          │  CP-SAT dispatch)      │
                                                           └────────────────────────┘
```

The Node backend orchestrates everything; the Python OR-Tools service is called internally over HTTP purely to solve the constrained assignment problem (max-score bipartite matching under worker capacity constraints) — it holds no state of its own.

---

## 5. Core Features (by Flow)

| # | Flow | What it does |
|---|---|---|
| 0–1 | **Setup & Multi-Role Auth** | JWT auth for Customer / Worker / Cooperative Admin, cooperative registration, worker onboarding with skills & certifications |
| 2 | **AI Job Understanding** | Natural language (typed or spoken) → Gemini → structured multi-task Job Graph with dependencies |
| 3 | **Job & Task Management** | Full task lifecycle state machine (`pending → assigned → in_progress → completed → verified`), dependency-gated task starts |
| 4 | **Dispatch Engine + Opportunity Ledger** | OR-Tools CP-SAT solver picks the assignment that maximizes total score (skill 40pts + proximity 30pts + fairness 20pts + rating 10pts) across *all* pending tasks simultaneously — not greedily, and not rating-first |
| 5 | **WorkCell Orchestration** | Redis-backed live presence + Socket.IO rooms per job, so multi-worker crews and their customer see task status changes instantly, with no polling |
| 6 | **Self-Healing** | Worker self-reports, missed check-ins (30-min scheduler scan), and socket disconnects (2-min grace period) all trigger reopening + re-dispatching just the affected task, excluding the failed worker |
| 7 | **Execution & Live Tracking** | Pause/resume, live worker-location broadcast during active tasks, full timeline log per job |
| 8 | **Completion Proof** | Photo/video capture (camera-direct on mobile), required before a task can be marked complete |
| 9 | **Itemised Settlement** | Auto-generated per-task billing once a job completes — worker payout vs. cooperative commission split |
| 10 | **Notifications** | Real-time (WebSocket) + persisted feed across all three roles |
| 11 | **Cooperative Admin Dashboard** | Worker roster management, certification approval, job oversight, fill-rate/dispatch-speed/earnings analytics |
| 12 | **Ratings & Feedback** | Post-completion ratings feed back into (but intentionally never dominate) future dispatch scoring |
| 13 | **Availability & Location** | Structured weekly availability windows, live + periodic location pings for dispatch proximity scoring |

---

## 6. What Makes the Dispatch Engine Different

Most gig platforms assign work greedily to whoever has the highest rating or is simply first to respond. SAHYOG FLOW instead:

1. **Hard-filters** candidates by skill match, active certification, online availability, remaining capacity, and a distance cutoff.
2. **Scores** every eligible worker across four independent signals — skill match, proximity, a 30-day **fairness rotation** score (workers who've received fewer recent opportunities score higher), and rating (capped at 10/100 points so it can never dominate).
3. **Solves globally**, not task-by-task — OR-Tools' CP-SAT solver finds the assignment across *all* pending tasks in a job simultaneously that maximizes total score, subject to each worker's remaining capacity. This matters the moment two tasks in the same job compete for the same qualified worker.
4. **Explains itself** — every assignment stores its full score breakdown and a human-readable reason, visible to both the worker ("why was I picked?") and the customer ("why this worker?").

---

## 7. Folder Structure

```
backend/
  server.js
  src/
    config/        # env, db (Mongo), redis
    models/        # User, Job, Task, WorkCell, OpportunityLedger, Settlement, Rating...
    controllers/
    routes/
    services/       # dispatchEngineService, jobGraphService, workCellService, selfHealingService...
    sockets/         # WebSocket handlers
    middlewares/     # auth, roleGuard, errorHandler
    utils/

dispatch-solver/     # Python OR-Tools microservice
  app.py
  solver.py

frontend/
  src/
    features/
      auth/
      jobRequest/
      workerTasks/
      workcell/
      cooperativeAdmin/
      notifications/
    shared/
      components/
      hooks/
      utils/
```

Each frontend feature is self-contained: `components/`, `hooks/`, `service/` (API calls), and a `*Context.jsx` for local state — no global state management library needed.

---

## 8. Running the Project Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- A MongoDB Atlas connection string (or local MongoDB)
- Redis (installed locally, or via any container runtime)
- A free Gemini API key from [aistudio.google.com](https://aistudio.google.com/apikey)

### Environment variables (`backend/.env`)
```
PORT=5000
NODE_ENV=development
MONGO_URI=<your MongoDB Atlas connection string>
REDIS_URL=redis://localhost:6379
JWT_SECRET=<any random string>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=<your free Gemini key>
GEMINI_MODEL=gemini-2.0-flash
DISPATCH_SOLVER_URL=http://localhost:8000
```

### Start order (4 terminals)
```bash
# 1. Redis
redis-server

# 2. OR-Tools dispatch solver
cd dispatch-solver
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# 3. Backend
cd backend
npm install
npm run dev

# 4. Frontend
cd frontend
npm install
npm run dev
```

Visit the frontend URL Vite prints (typically `http://localhost:5173`).

---

## 9. Demo Walkthrough

1. **Customer** logs in, describes a multi-trade request (typed or spoken) → sees it decomposed into a Job Graph in seconds.
2. Tasks are auto-dispatched — customer can expand **"why this worker?"** to see the full transparent scoring.
3. **Worker** logs in (separate session), sees the assigned task with the same explanation, starts it — the customer's view updates live via WebSocket, no refresh.
4. Worker uploads photo proof and marks the task complete; customer verifies it.
5. Once all tasks in a job are done, an **itemised settlement** appears automatically on the customer side, and the corresponding payout appears on the worker's Earnings page.
6. To demonstrate **self-healing**: a worker reports they can't complete an assigned task — it's instantly reopened and reassigned to a different qualified worker, with no admin intervention.
7. **Cooperative Admin** logs in to show the roster, certification approvals, and live analytics (fill rate, average dispatch time, earnings distributed).

---

## 10. Team & Problem Statement

**Problem Statement ID:** SIH26089
**Theme:** Cooperative / Gig Workforce Management

---

*Built for Smart India Hackathon 2026.*