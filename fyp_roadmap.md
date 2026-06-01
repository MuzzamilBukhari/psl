# V2PSL — How It Works & Full Roadmap

## Part 1: How the Basic Prototype Works

The basic version is a self-contained single-page app with **zero dependencies** beyond Three.js loaded from a CDN. Here's every moving part:

---

### 🎙️ 1. Voice Input (`Web Speech API`)
- The **"Use Mic"** button triggers `window.SpeechRecognition` (browser-native).
- It listens in `en-US`, captures a transcript in real-time, and dumps it into the text area.
- No server involved — 100% client-side.

---

### 🧠 2. Text-to-Gloss Pipeline (NLP — all client JS)

This is the core "translation" engine. It runs in 3 layers:

```
Raw English Text
      │
      ▼
┌─────────────────────────────────────────────────────┐
│ Layer 1: Phrase Template Matching (regex rules)     │
│  e.g. "Hello my name is Ahmed" → [hello, i, name,  │
│        ahmed]  (PSL intro template)                 │
└─────────────────────────────────────────────────────┘
      │ (if no template matched)
      ▼
┌─────────────────────────────────────────────────────┐
│ Layer 2: Stop-word removal + Synonym mapping        │
│  - STOP set: removes "is", "the", "a", "to", etc.  │
│  - SYN map: "hi" → "hello", "thanks" → "thank_you" │
│    "eat" → "food", "house" → "home", etc.           │
└─────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────┐
│ Layer 3: Token output                               │
│  - Known token → played from SIGNS dictionary       │
│  - Unknown token → fingerspelled letter-by-letter   │
└─────────────────────────────────────────────────────┘
```

**Output**: An array of gloss tokens like `["hello", "i", "name", "ahmed"]`

---

### 🧍 3. 3D Avatar (Three.js + GLB model)

- A **Ready Player Me** (or similar) `.glb` humanoid is loaded via `GLTFLoader`.
- On load, the system:
  1. Traverses the skeleton and maps bone names (`RightArm`, `LeftForeArm`, `Head`, etc.) into a `bones{}` object.
  2. Stores the **rest quaternion** of every bone (this is the neutral T-pose).
  3. Computes **body landmarks** — world-space 3D positions of key anchor points (head, chest, hips, shoulders, hands).
  4. Measures **arm lengths** (upper arm = shoulder→elbow distance, lower arm = elbow→hand distance).

---

### 🦾 4. IK Animation Engine

The most sophisticated part. It uses a **2-bone analytical IK solver** (Law of Cosines):

```
Given:
  - shoulder position (world)
  - hand TARGET position (world)
  - upper arm length + forearm length

Computes:
  - elbow world position (via cosine law + pole vector)
  - aims upper arm bone at the elbow
  - aims forearm bone at the hand target
```

**Signs are defined as hand TARGET POSITIONS** relative to body landmarks, not as raw bone rotations. Example:

```js
hello: {
  kf: [
    { d: 400, rh: () => LM.head.clone().add(v(0.15, 0.05, 0.22)) },
    { d: 250, rh: () => LM.head.clone().add(v(0.25, 0.05, 0.25)) },
    ...
  ]
}
```

This makes signs **model-agnostic** — they work on any humanoid avatar regardless of bone orientations.

---

### 🎬 5. Animation Playback

- Each sign is a sequence of **keyframes**, each with a duration (ms) and target hand positions.
- Between keyframes: hand positions are **linearly interpolated** (lerped) with an ease-in-out curve.
- Between signs: arms smoothly **slerp back to rest pose**.
- UI shows active gloss token highlighted in the gloss strip, plus current sign name/description overlay.

---

### 🗂️ 6. Sign Dictionary

Currently has **~26 hardcoded signs**: hello, thank_you, school, yes, no, i, you, name, good, bad, how, please, sorry, help, food, water, home, love, friend, peace, welcome, learn, what, want, etc.

Unknown words fall back to **fingerspelling** (26 letter positions distributed around the head area).

---
---

## Part 2: Tech Stack Decision

| Layer | Choice | Reason |
|---|---|---|
| Frontend | **Next.js 14 (App Router)** | SSR + CSR hybrid, easy API routes, great ecosystem |
| 3D Rendering | **React Three Fiber (R3F) + @react-three/drei** | React-friendly Three.js, declarative scene graph |
| Backend | **FastAPI (Python)** | Async, auto docs, great for ML/NLP integration |
| Database | **PostgreSQL** ✅ | See below |
| Auth | **NextAuth.js** (or Clerk) | Quick auth with social login |
| Deployment | **Vercel** (frontend) + **Railway/Render** (backend) | Simple, free tier available |

### ✅ PostgreSQL — Yes, it's ideal for this project

PostgreSQL is perfect because:
- You'll store **user sign history** (what sentences were translated, when)
- **Sign dictionary** can be managed in DB with an admin panel
- **User accounts** with translation preferences and saved phrases
- Future: **feedback/ratings** on sign quality → feeds back into improving the system
- JSONB support for storing sign keyframe data flexibly

---
---

## Part 3: Complete Phased Roadmap

---

### 📦 Phase 0: Project Bootstrap (1–2 days)

**Goal**: Empty `actual/frontend` and `actual/backend` scaffolded and running.

**Frontend (Next.js)**:
```bash
cd actual/frontend
npx create-next-app@latest . --typescript --tailwind --app --src-dir
npm install three @react-three/fiber @react-three/drei
npm install @types/three zustand
```

**Backend (FastAPI)**:
```bash
cd actual/backend
python -m venv venv
pip install fastapi uvicorn sqlalchemy asyncpg alembic psycopg2-binary pydantic python-dotenv
```

**Deliverables**:
- [ ] Next.js app running on `localhost:3000`
- [ ] FastAPI app running on `localhost:8000` with `/docs` working
- [ ] PostgreSQL running (local Docker or Supabase)
- [ ] `.env` files configured

---

### 🏗️ Phase 1: Database Schema + FastAPI Foundation (3–4 days)

**Goal**: Backend API with core models and endpoints.

#### Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sign Dictionary
CREATE TABLE signs (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,        -- e.g. "hello", "thank_you"
  label TEXT NOT NULL,             -- display name
  description TEXT,                -- "Open hand near forehead, wave side to side"
  category TEXT,                   -- "greeting", "emotion", "question"
  keyframes JSONB NOT NULL,        -- the kf[] array as JSON
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Translation History
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  gloss_tokens TEXT[] NOT NULL,
  mode TEXT,                       -- "template", "lexical"
  fingerspelled_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Synonym Map
CREATE TABLE synonyms (
  id SERIAL PRIMARY KEY,
  word TEXT UNIQUE NOT NULL,       -- e.g. "hi"
  maps_to TEXT NOT NULL            -- e.g. "hello"
);
```

#### FastAPI Endpoints (Phase 1)

```
POST /api/translate
  Body: { text: string }
  Returns: { tokens: string[], mode: string, notes: string[] }

GET  /api/signs
  Returns: list of all active signs with metadata

GET  /api/signs/{key}
  Returns: single sign with keyframes

POST /api/signs (admin)
  Create a new sign

GET  /api/history (auth required)
  Returns user's past translations
```

**Deliverables**:
- [ ] Alembic migrations working
- [ ] All CRUD for signs
- [ ] `/api/translate` endpoint (port the JS NLP logic to Python)
- [ ] Pydantic models and schema validation
- [ ] CORS configured for Next.js origin

---

### 🎨 Phase 2: Next.js Frontend — UI Shell + Translation (5–7 days)

**Goal**: Full UI in Next.js, hitting the FastAPI backend.

#### Pages / Routes

```
/                    → Landing page (hero, demo CTA)
/translate           → Main translator page (the core app)
/dictionary          → Browse all signs
/history             → Past translation history (auth required)
/admin/signs         → Add/edit signs (admin only)
```

#### Component Architecture

```
src/
├── app/
│   ├── page.tsx                 (landing)
│   ├── translate/
│   │   └── page.tsx             (main app)
│   ├── dictionary/
│   │   └── page.tsx
│   └── api/                     (Next.js API routes for auth)
├── components/
│   ├── translator/
│   │   ├── InputPanel.tsx       (text area + voice btn + translate btn)
│   │   ├── GlossStrip.tsx       (token chips with active/done states)
│   │   ├── TranslationMeta.tsx  (mode, notes, pills)
│   │   ├── SpeedControl.tsx     (slider)
│   │   └── DictGrid.tsx         (clickable sign list)
│   ├── avatar/
│   │   ├── AvatarCanvas.tsx     (R3F Canvas wrapper)
│   │   ├── AvatarModel.tsx      (GLB loader + bone registry)
│   │   ├── AvatarHUD.tsx        (current sign overlay, status bar)
│   │   └── IKController.tsx     (IK solver + animation engine)
│   └── ui/
│       ├── Header.tsx
│       └── StatusBar.tsx
├── hooks/
│   ├── useTranslation.ts        (API call to /api/translate)
│   ├── useVoiceInput.ts         (Web Speech API abstraction)
│   └── useSignPlayer.ts         (manages animation queue/state)
├── store/
│   └── translatorStore.ts       (Zustand — tokens, isPlaying, speed)
└── lib/
    ├── api.ts                   (fetch wrapper for FastAPI)
    └── ikSolver.ts              (port of the IK math to TypeScript)
```

**Deliverables**:
- [ ] Input panel with voice and text input
- [ ] Gloss strip with animated token highlighting
- [ ] Speed slider wired to Zustand store
- [ ] API integration with `/api/translate` on backend
- [ ] Dictionary page pulling signs from DB

---

### 🦾 Phase 3: 3D Avatar in React Three Fiber (7–10 days)

**Goal**: Port the entire Three.js avatar + IK animation system to React Three Fiber.

#### Key R3F concepts you'll use

```tsx
// AvatarCanvas.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

export function AvatarCanvas() {
  return (
    <Canvas camera={{ position: [0, 1.3, 3.2], fov: 35 }}>
      <ambientLight intensity={0.5} />
      <hemisphereLight skyColor="#ffffff" groundColor="#444466" intensity={1} />
      <AvatarModel />
      <OrbitControls enablePan={false} minDistance={1.5} maxDistance={6} />
    </Canvas>
  )
}
```

```tsx
// IKController.tsx — runs in useFrame() which is R3F's animation loop
import { useFrame } from '@react-three/fiber'

export function IKController({ tokens, isPlaying }) {
  useFrame(() => {
    // Run IK animation step here — same math as app.js
  })
}
```

#### IK Solver Port (TypeScript)

The `solve2BoneIK`, `aimBoneAt`, `applyArmIK` functions need to be **cleanly ported** to TypeScript using `three` (which R3F already depends on). This is straightforward since the math is pure.

```ts
// lib/ikSolver.ts
import * as THREE from 'three'

export function solve2BoneIK(
  rootPos: THREE.Vector3,
  targetPos: THREE.Vector3,
  upperLen: number,
  lowerLen: number,
  polePos: THREE.Vector3
): THREE.Vector3 { ... }
```

#### Avatar GLB Loading Strategy

- Store `avatar.glb` in `public/` directory of Next.js
- Use `useGLTF('/avatar.glb')` from `@react-three/drei`
- Bone discovery and landmark computation happen in a `useEffect` on first load

**Deliverables**:
- [ ] Avatar renders correctly in R3F Canvas
- [ ] IK solver ported to TypeScript
- [ ] Sign keyframes ported — signs play correctly
- [ ] Fingerspelling works
- [ ] `useSignPlayer` hook manages sign queue
- [ ] Smooth interpolation between signs

---

### 🔐 Phase 4: Auth + History + Admin + Deploy (5–7 days)

**Goal**: Production-ready app.

#### Auth (NextAuth.js)
- Google OAuth login
- JWT tokens forwarded to FastAPI for protected routes
- Translations saved to DB per user

#### Admin Panel (`/admin/signs`)
- Table view of all signs in DB
- Edit keyframes (JSON editor)
- Add synonyms
- Toggle sign active/inactive

#### Deployment
```
Frontend → Vercel (free)
Backend  → Railway or Render (free tier)
Database → Supabase (free PostgreSQL, 500MB)
GLB file → Cloudflare R2 or Vercel /public
```

**Deliverables**:
- [ ] Login/logout working
- [ ] Translation history page
- [ ] Admin CRUD for signs
- [ ] Environment variables configured for prod
- [ ] CI/CD via GitHub Actions

---

## Summary Timeline

| Phase | Focus | Duration |
|---|---|---|
| 0 | Project bootstrap | 1–2 days |
| 1 | DB schema + FastAPI NLP API | 3–4 days |
| 2 | Next.js UI shell + API integration | 5–7 days |
| 3 | R3F avatar + IK animation port | 7–10 days |
| 4 | Auth + history + admin + deploy | 5–7 days |
| **Total** | | **~21–30 days** |

---

## What to Build First (Recommended Starting Point)

> **Start with Phase 1: the `/api/translate` endpoint.**
>
> Port the JS NLP logic (`textToGloss`, `matchPhraseTemplate`, `STOP`, `SYN`) to Python. This is the core intellectual contribution and everything else depends on it. You can test it instantly via `/docs` in FastAPI without touching the frontend.

---

## Future Enhancements (Post-FYP / Research Extensions)

- 🤖 **ML-based translation**: Replace the rule-based NLP with a fine-tuned Seq2Seq model (e.g. mBART or T5) trained on English → PSL gloss pairs
- 🖐️ **Finger articulation**: Add per-finger bone control (ASL-style handshape) using MediaPipe Hand landmarks as reference
- 📹 **Video export**: Use `MediaRecorder` API to let users download the signed video
- 🌐 **Urdu input support**: Accept Urdu text → transliterate → translate to PSL gloss
- 📊 **Sign quality feedback**: Let Deaf users rate translations to create a labeled dataset
