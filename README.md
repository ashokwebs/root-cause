# Root Cause

**HACKFEST'26 · Team OSPRED**

A diagnostic tutoring platform that traces a student's wrong answer back to the exact prerequisite concept they haven't mastered — then teaches *that* first.

---

## The Problem

When a student misses a factoring problem, traditional tutors re-explain *that exact problem*. The student nods — and gets the *next* one wrong too, for the same invisible reason. The real gap stays hidden.

## Our Solution

Root Cause doesn't just flag the wrong answer. It:

1. **Captures** the student's specific wrong answer
2. **Classifies** the error pattern against known misconception categories
3. **Traverses** a hand-authored prerequisite dependency graph
4. **Identifies** the true root cause (e.g., "Integer Addition", not "Factoring")
5. **Delivers** a targeted micro-lesson on the actual gap

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (glassmorphism design system) |
| Backend | Node.js (zero external dependencies) |
| Database | Firebase Firestore (real-time sync) |
| Diagnostic Engine | Deterministic rule-based parser |
| Deployment | Vercel (serverless functions + static hosting) |

## Project Structure

```
root-cause/
├── api/                    # Vercel serverless functions
│   ├── _helpers.js         # Shared diagnostic logic
│   ├── questions.js        # GET /api/questions
│   ├── graph.js            # GET /api/graph
│   ├── diagnose.js         # POST /api/diagnose
│   └── health.js           # GET /api/health
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── api.js          # API client
│   │   ├── firebase.js     # Firebase config
│   │   └── App.jsx         # Main application
│   └── package.json
├── server/                 # Local dev backend
│   ├── data/               # Question bank + concept graph
│   ├── diagnostics.js      # Graph traversal logic
│   ├── parser.js           # Deterministic classification engine
│   └── index.js            # HTTP server
├── vercel.json             # Vercel deployment config
└── README.md
```

## Running Locally

### 1. Start the Backend

```bash
cd server
node index.js
```

The API server starts on `http://localhost:4000`.

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev
```

The dev server starts on `http://localhost:5173`.

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Vercel will auto-detect the `vercel.json` config
4. The frontend builds from `client/` and API routes deploy as serverless functions from `api/`

No environment variables are required — the diagnostic engine runs entirely offline.

## Features

- **52 Randomized Questions** — shuffled on every page load
- **Instant Diagnostics** — deterministic parser, zero latency
- **Student Leaderboard** — real-time accuracy rankings via Firebase
- **Teacher Dashboard** — aggregated root cause analytics, CSV export, lesson plan generation
- **Concept Dependency Graph** — interactive visualization of prerequisite chains
- **Responsive Design** — glassmorphism UI with micro-animations

## Team

Built by **Team OSPRED** for HACKFEST'26.

## License

MIT License — see [LICENSE](LICENSE) for details.
