Perfect — let’s shift the HLD (High-Level Design) based on your new idea: **learners pitch to teachers** instead of automatic matching. Here's the updated HLD in a clear, structured format:

---

## 🔧 HLD: 1:1 Skill Exchange Platform (Pitch-Based)

### 🧠 Core Concept

Users can register as **learners**, **teachers**, or both.  
Learners **pitch** their learning request to a teacher.  
Teachers can **accept**, **reject**, or **ignore** pitches.

---

### 🗂️ 1. Entities & Relationships

#### 👤 `User`

- `_id`, `name`, `email`, `passwordHash`, `role: "learner" | "teacher" | "both"`
- `skillsOffered: string[]` — if teacher
- `skillsWanted: string[]` — if learner
- `bio`, `avatar`, `timezone`

#### 📬 `Pitch`

- `_id`, `fromUser`, `toTeacher`
- `skillRequested`, `message`, `status: "pending" | "accepted" | "rejected"`
- `createdAt`, `updatedAt`

#### 🧑‍🏫 `Session` _(created after pitch accepted)_

- `_id`, `learnerId`, `teacherId`
- `skill`, `scheduledAt`, `duration`, `zoomLink`, `status`

---

### 🔐 2. Auth System (MERN + JWT)

- Signup/login routes
- Role-based access (middleware)
- JWT auth token, refresh token, protected routes

---

### 🧩 3. Core Features

#### ✅ For All Users:

- Signup/login
- Set skills offered/wanted
- Edit profile
- View others' profiles

#### 🧑‍🎓 Learner Features:

- Browse teachers by skill
- Send pitch to teacher (custom message)
- Track pitch status (pending/accepted/rejected)
- Join session after acceptance

#### 🧑‍🏫 Teacher Features:

- View incoming pitches
- Accept or reject
- View upcoming sessions

---

### 🌐 4. Backend APIs

| Route                      | Method | Description             |
| -------------------------- | ------ | ----------------------- |
| `/api/auth/signup`         | POST   | Create user             |
| `/api/auth/login`          | POST   | Authenticate user       |
| `/api/users/:id`           | GET    | Get user profile        |
| `/api/pitches`             | POST   | Send pitch              |
| `/api/pitches/:id/respond` | PATCH  | Accept/reject           |
| `/api/sessions`            | GET    | View scheduled sessions |

---

### 💾 5. Tech Stack

- **Frontend**: React + TypeScript + Tailwind (Next.js optional)
- **Backend**: Express + MongoDB + Mongoose + TypeScript
- **Auth**: JWT + bcrypt
- **Scheduling**: Manual for now (later Google/Zoom calendar APIs)
- **Hosting**: Render/Netlify for MVP

---

### 🔄 6. MVP Flow

1. User signs up → selects role (learner/teacher)
2. Learner browses teachers by skill
3. Sends pitch → stored in DB as `pending`
4. Teacher sees pitch → accepts
5. Session created → Zoom/Google link optional
6. Both join the session → done

---

This is lean, focused, and easy to build in 3–4 weeks if you stay consistent.

Want me to generate a backend folder structure + first model (e.g., `User`)?
