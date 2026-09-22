# 🗺️ Project Roadmap & Core Flows

This document outlines the end-to-end operational architecture of the platform, organized by sequential development and execution flows.

---

### 🪵 Phase 1: Foundations & Identity

#### 🔹 Flow 0 — Project Setup & Core Infrastructure
* **Core:** Base Express server scaffolding, environment configuration, and centralized error-handling middleware.
* **Data:** Persistent MongoDB connectivity, Redis integration, and structural folder layout.
* **Comms & Telemetry:** WebSocket server bootstrapping and custom logger implementation.

#### 🔹 Flow 1 — Auth & Multi-Role Onboarding
* **Identity:** Secure Signup/Login workflows for three distinct roles: **Customer**, **Worker**, and **Cooperative-Admin**.
* **Security:** JWT-based authentication and role-enforcing middleware layers.
* **Compliance:** Worker KYC verification, certification/skill uploads, and formal cooperative registration portals.

---

### 🧠 Phase 2: AI Intake & Task Lifecycle

#### 🔹 Flow 2 — AI Request Understanding (NL → Job Graph)
* **Intake:** Customer submits an operational request via raw text or voice inputs.
* **Processing:** Browser-native Speech-to-Text conversion mapped directly to an LLM API orchestrator.
* **Decomposition:** Natural Language transformed dynamically into a structured, multi-task **Job Graph** detailing sequential tasks, hard dependencies, required skills/certs, and estimated durations.
* **Persistence:** Fully resolved graph schema written permanently to the database.

#### 🔹 Flow 3 — Job & Task Management
* **Operations:** Comprehensive CRUD layers handling parent Jobs and their granular child Tasks.
* **State Control:** Robust task state-machine managing explicit transitions:
  \[\text{Pending} \longrightarrow \text{Assigned} \longrightarrow \text{In-Progress} \longrightarrow \text{Done} \longrightarrow \text{Verified}\]
* **Execution:** Automated blocking mechanics driven by graph-based task dependency resolution.

---

### ⚙️ Phase 3: Intelligent Dispatch & Orchestration

#### 🔹 Flow 4 — Dispatch Engine & Opportunity Ledger
* **Optimization:** Multi-constraint matching utilizing OR-Tools, factoring in real-time skills, certifications, availability, precise location, and active worker capacity.
* **Equity:** Decentralized **Opportunity Ledger** tracking offer distribution to guarantee fair, non-biased rotation among eligible workers.
* **Auditability:** Transparent, explainable assignment reasoning stored permanently alongside each assigned task.

#### 🔹 Flow 5 — WorkCell Real-Time Orchestration
* **Grouping:** Redis-backed dynamic **WorkCells** formed as transient, multi-worker project teams per job.
* **Sync:** Dedicated WebSocket data channels per active WorkCell pushing real-time task-state updates.
* **Presence:** Low-latency connection tracking maintaining live member availability statuses.

---

### 🚨 Phase 4: Resiliency & Real-Time Execution

#### 🔹 Flow 6 — Self-Healing & Failure Recovery
* **Heuristics:** Automated worker drop-off detection triggered by missed check-ins, manual cancellations, or quiet timeouts.
* **Isolation:** Surgical blast radius containment—reopening only the individual affected task without corrupting the broader job.
* **Recovery:** Scoped execution of the dispatch engine to source immediate replacements, followed by live notifications to remaining WorkCell members.

#### 🔹 Flow 7 — Execution & Live Progress Tracking
* **Controls:** Worker-side interaction hooks for standard task actions (`start` / `pause` / `complete`).
* **Telemetry:** Continuous location and status updates streamed directly to the customer over live WebSockets.
* **Audit Trail:** Immutable, time-stamped activity log capturing every structural transition per job.

---

### 📊 Phase 5: Verification, Settlements & Metrics

#### 🔹 Flow 8 — Completion Proof
* **Telemetry:** On-site media capture requiring photos, videos, or digital signatures at the point of task finalization.
* **Storage:** Secure direct object-storage uploads mapped to target data blocks.
* **Verification:** Asynchronous verification workflow managed via automated checking pipelines or admin override panels.

#### 🔹 Flow 9 — Itemized Settlement & Payout
* **Accounting:** Granular cost computation aggregated from individual task completion metrics.
* **Splits:** Multi-party payout resolution splitting funds across worker earnings, cooperative commission takes, and system infrastructure cuts.
* **Ledgers:** Fully compiled itemized customer bills generated concurrently with unalterable settlement ledger writes.

---

### 🛰️ Phase 6: System Overlays & Management

#### 🔹 Flow 10 — Notifications
* **Buses:** Dual-channel notification system processing real-time WebSocket frames alongside durable database-backed notification feeds.
* **Scope:** Tailored event delivery for all roles tracking job offers, status mutations, safety alerts, and fiscal payouts.

#### 🔹 Flow 11 — Cooperative Admin Dashboard
* **Management:** Global worker roster administration and granular certification/skill approval pipelines.
* **Oversight:** Macroscopic job lifecycle tracking and administrative command overrides.
* **Analytics:** High-level operational metrics processing fill-rates, average dispatch latencies, and localized earnings distributions.

#### 🔹 Flow 12 — Ratings & Feedback
* **Ingress:** Post-completion review funnel calculating explicit ratings and descriptive text feedback from Customer \(\rightarrow\) Worker.
* **Looping:** Downstream data injection pipeline feeding telemetry back into dispatch engine calculation scoring profiles without operating as a single-point failure vector.

#### 🔹 Flow 13 — Worker Availability & Location Management
* **Scheduling:** Self-service availability window interfaces configured directly by active workers.
* **Tracking:** Background location ping aggregators mapping localized worker positions.
* **Safety:** Strict operational thresholds capping maximum concurrent active tasks per worker.
